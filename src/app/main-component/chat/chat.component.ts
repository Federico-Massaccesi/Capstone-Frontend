import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  messages: string[] = [];
  userMessage: string = '';

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
  }

  sendMessage() {
    if (this.userMessage.trim().length > 0) {
      this.chatService.sendMessage(this.userMessage).subscribe(response => {
        this.messages.push(`User: ${this.userMessage}`);
        this.messages.push(`Bot: ${response.message}`);
        this.userMessage = '';
      });
    }
  }
}
