import { Resolver, Subscription, Args } from '@nestjs/graphql';
import { ChatCompletionChunk, ChatInput } from './chat.model';
import { ChatProxyService } from './chat.service';

@Resolver('Chat')
export class ChatResolver {
  constructor(private chatProxyService: ChatProxyService) {}

  @Subscription(() => ChatCompletionChunk, {
    nullable: true,
    resolve: (value) => value,
  })
  async *chatStream(@Args('input') input: ChatInput) {
    const iterator = this.chatProxyService.streamChat(input.message);

    try {
      for await (const chunk of iterator) {
        if (chunk) {
          yield chunk;
        }
      }
    } catch (error) {
      console.error('Error in chatStream:', error);
      throw new Error('Chat stream failed');
    }
  }
}
