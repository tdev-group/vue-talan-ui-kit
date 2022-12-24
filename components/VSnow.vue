<template>
    <div>
        <slot></slot>

        <canvas v-if="isWinter" ref="canvas" class="xmas__canvas"></canvas>
    </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator';

// Utils
import { getRandomNumber } from '@/utils/Helper';

// Interfaces
interface IFlake {
    x: number;
    y: number;
    size: number;
    speed: number;
    velY: number;
    velX: number;
    opacity: number;
    step: number;
    stepSize: number;
}

@Component({})
export default class VSnow extends Vue {
    @Ref() public canvas!: HTMLCanvasElement;

    snowImage: HTMLImageElement = new Image();

    readonly mobileFlakesCount = 20;
    readonly desktopFlakesCount = 60;

    public ctx: CanvasRenderingContext2D | null = null;
    public flakes: IFlake[] = [];
    public mX = -100;
    public mY = -100;
    public flakeCount = 0;

    get isWinter() {
        const month = new Date().getMonth();

        return month >= 11 || month <= 2;
    }

    public letItSnow() {
        this.snowImage.src = require(`@/assets/snow.svg?inline`);

        this.flakeCount = window.innerWidth < 999 ? this.mobileFlakesCount : this.desktopFlakesCount;

        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });

        (this.$el as HTMLElement).addEventListener('mousemove', (e) => {
            this.mX = e.clientX;
            this.mY = e.clientY;
        });

        this.generateFlakes();
    }

    public snow() {
        // Warning: someone else's code, I do not know how to rename variables

        if (!this.ctx) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const flake of this.flakes) {
            const x = this.mX,
                y = this.mY,
                minDist = 250,
                x2 = flake.x,
                y2 = flake.y;

            const dist = Math.sqrt((x2 - x) ** 2 + (y2 - y) ** 2);

            if (dist < minDist) {
                const force = minDist / dist ** 2,
                    xcomp = (x - x2) / dist,
                    ycomp = (y - y2) / dist,
                    deltaV = force;

                flake.velX -= deltaV * xcomp;
                flake.velY -= deltaV * ycomp;
            } else {
                flake.velX *= 0.98;
                if (flake.velY <= flake.speed) {
                    flake.velY = flake.speed;
                }
                flake.velX += Math.cos((flake.step += 0.05)) * flake.stepSize;
            }

            flake.y += flake.velY;
            flake.x += flake.velX;

            if (flake.y >= this.canvas.height || flake.y <= 0) {
                this.resetFlake(flake);
            }

            if (flake.x >= this.canvas.width || flake.x <= 0) {
                this.resetFlake(flake);
            }

            this.ctx.beginPath();
            this.ctx.drawImage(this.snowImage, flake.x, flake.y, flake.size, flake.size);
            this.ctx.fill();
        }

        requestAnimationFrame(this.snow);
    }

    public resetFlake(flake: IFlake) {
        Object.assign(flake, {
            x: Math.floor(Math.random() * this.canvas.width),
            y: 0,
            size: getRandomNumber(5, 13),
            speed: Math.random() + 0.5,
            velY: flake.speed,
            velX: 0,
            opacity: Math.random() * 0.5 + 0.3
        });
    }

    public generateFlakes() {
        this.flakes = Array.from({ length: this.flakeCount }, () => {
            const speed = Math.random() + 0.5;

            return {
                speed,
                velY: speed,
                velX: 0,
                x: Math.floor(Math.random() * this.canvas.width),
                y: Math.floor(Math.random() * this.canvas.height),
                size: getRandomNumber(5, 13),
                stepSize: Math.random() / 160,
                step: 0,
                opacity: Math.random() * 0.5 + 0.3
            };
        });

        this.snow();
    }

    public mounted() {
        if (this.isWinter) this.letItSnow();
    }
}
</script>

<style lang="scss">
.xmas__canvas {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
}
</style>
