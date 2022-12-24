<template>
    <div class="chat">
        <div class="chat__header">
            <slot :users="users" name="header"></slot>
        </div>

        <div class="chat__body">
            <VChatMessages
                v-if="chat"
                ref="chatMessages"
                :messages="messages"
                :pending-messages="pendingMessages"
                :users="users"
            ></VChatMessages>

            <VSpinner v-else class="chat__spinner"></VSpinner>
        </div>

        <div class="chat__input">
            <VTextarea v-model="message" v-focus="'textarea'" self-send @send="send" />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Ref } from 'vue-property-decorator';

// Components
import VSpinner from '@/components/VSpinner.vue';
import VChatMessages from './VChatMessages.vue';
import VTextarea from '@/components/VTextarea.vue';

// Mixins
import VChatMixin from '@/mixins/VChatMixin';

@Component({
    components: { VSpinner, VChatMessages, VTextarea },
})
export default class VChat extends VChatMixin {
    @Ref('chatMessages')
    public chatMessages?: VChatMessages;

    public message = '';

    public async hookNewMessages() {
        if (this.chatMessages?.isChatScrolledToBottom()) {
            await this.$nextTick();
            this.chatMessages.scrollToBottom();
        }
    }

    public async hookSendPendingMessage() {
        await this.$nextTick();
        this.chatMessages?.scrollToBottom();
    }

    public async send(message: string) {
        this.message = '';

        await this.sendMessage(message);

        this.chatMessages?.scrollToBottom();
    }

    public closeChat() {
        this.$emit('closeChat');
    }
}
</script>

<style lang="scss">
.chat {
    display: contents;

    &__body {
        display: flex;
        flex-direction: column;
        flex: 1 1 100%;
        overflow: auto;
    }

    &__spinner {
        margin: auto;
    }

    &__input {
        bottom: 0;
        margin-top: auto;

        width: 100%;
        height: 8.4375rem;

        padding: 1.5rem;

        box-shadow: 0 1px 10px rgba(88, 88, 88, 0.15);
        background: var(--color-white);
    }
}
</style>
