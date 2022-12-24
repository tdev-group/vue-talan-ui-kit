<template>
    <div class="chat-messages">
        <VirtualList
            ref="virtualList"
            :data-component="messageComponent"
            :data-sources="messageList"
            :keeps="20"
            class="chat-messages__scroll"
            data-key="id"
            @hook:mounted="scrollToBottom"
        />

        <div v-if="!hasNoMessages" class="chat-messages__empty-title">
            {{ $t('page.designing.plans.form.noMessages') }}
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';

// Utils
import UserService from '@/utils/UserService';
import { isElementScrolledToBottom } from '@/utils/Helper';

// Interfaces
import User from '@/ship/Models/User';
import { IChatMessage, IChatPendingMessage } from '@/ship/Models/Chats';

// Components
import VChatMessage from '@/components/VChat/VChatMessage.vue';
import VirtualList from '@/plugins/VirtualList';

@Component({
    components: {
        VChatMessage,
        VirtualList,
    },
})
export default class VChatMessages extends Vue {
    @Ref()
    public virtualList?: typeof VirtualList;

    @State user!: User;

    @Prop({ type: Array, default: () => [] })
    public messages!: IChatMessage[];

    @Prop({ type: Array, default: () => [] })
    public pendingMessages!: IChatPendingMessage[];

    @Prop({ type: Array, default: () => [] })
    public users!: User[];

    messageComponent = VChatMessage;

    get hasNoMessages() {
        return Boolean(this.messages.length || this.pendingMessages.length);
    }

    get messageList() {
        return [...this.normalizedMessages, ...this.pendingMessages];
    }

    get normalizedMessages() {
        return this.messages.map((message) => {
            const messageAuthor = this.users.find(({ id }) => id === message.userId);

            return {
                id: message.id,
                author: messageAuthor,
                name: UserService.getShortName(messageAuthor),
                body: message.body,
                date: message.createdAt,
                isSelf: message.userId === this.user.id,
            };
        });
    }

    public scrollToBottom() {
        this.virtualList?.scrollToBottom();
    }

    public isChatScrolledToBottom() {
        return isElementScrolledToBottom(this.$el);
    }
}
</script>

<style lang="scss">
:root {
    @include defineColor(--chat-messages-text-color, $color-cold-gray);
}

.chat-messages {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;

    overflow: hidden;

    padding: 1.5rem 0 0;

    &__scroll {
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        padding-right: 1.5rem;
    }

    &__message {
        position: relative;
        width: 20.5rem;

        margin-bottom: 1.5rem;
        margin-right: auto;
        margin-left: 1.5rem;
        padding: 1.1875rem 1rem 1rem;

        background-color: var(--color-bg-main);
        border-radius: 0.625rem;

        &--mine {
            background-color: var(--color-tundora);
            margin-left: auto;
            margin-right: 0;

            .chat-messages {
                &__name,
                &__text {
                    color: var(--color-white);
                }

                &__date {
                    color: var(--color-iron);
                }
            }
        }

        &--pending {
            background: var(--color-silver);
        }
    }

    &__message-icon {
        @extend %icon;

        position: absolute;
        top: 0;
        left: -0.5rem;
        transform: translateX(-100%);

        &--error {
            color: var(--color-red);
        }
    }

    &__empty-title {
        margin: auto;
        text-align: center;
    }

    &__name {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        margin: 0 0 1rem;

        font-weight: 500;
        font-size: 0.875rem;
        line-height: 1rem;
        color: var(--color-tundora);
    }

    &__date {
        position: absolute;
        top: 1.3125rem;
        right: 1rem;

        font-size: 0.75rem;
        line-height: 0.875rem;
        color: var(--color-silver);
    }

    &__text {
        margin: 0;

        font-size: 0.875rem;
        line-height: 1.4em;
        white-space: pre-wrap;
        word-break: break-word;

        color: var(--chat-messages-text-color);
    }
}
</style>
