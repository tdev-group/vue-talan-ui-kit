<template>
    <div
        :class="{
            'chat-messages__message--mine': source.isSelf | isPendingMessage,
            'chat-messages__message--pending': isPendingMessage,
        }"
        class="chat-messages__message"
    >
        <slot>
            <div
                v-if="isPendingMessage"
                v-tooltip="{
                    content: source.error,
                    placement: 'bottom',
                }"
                class="chat-messages__message-icon chat-messages__message-icon--error"
            >
                <ExclamationCircleSVG />
            </div>

            <template v-else>
                <div class="chat-messages__name">
                    <VUserAvatar :user="source.author"></VUserAvatar>
                    <span>{{ source.name }}</span>
                </div>

                <div class="chat-messages__date">{{ source.date | simpleTime }}</div>
            </template>

            <p class="chat-messages__text">{{ source.body }}</p>
        </slot>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

// Component
import VUserAvatar from '@/components/VUserAvatar.vue';

// Svg
import ExclamationCircleSVG from '@/assets/exclamation-circle.svg';

// Interfaces
import { IChatPendingMessage, INormalizedChatMessage } from '@/ship/Models/Chats';

@Component({
    components: { VUserAvatar, ExclamationCircleSVG },
})
export default class VChatMessage extends Vue {
    @Prop({ type: Object, default: () => ({}) })
    public source!: INormalizedChatMessage | IChatPendingMessage;

    get isPendingMessage() {
        return Object.hasOwn(this.source, 'error');
    }
}
</script>

<style lang="scss"></style>
