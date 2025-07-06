// File: app/ChatbotAssistant.js

"use client";

import { useEffect } from 'react';
import './Chatbot.css'; // Impor CSS

const ChatbotAssistant = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.rrAssistantInstance) {
      
      class RRAssistant {
        constructor() {
          this.chatContainer = null;
          this.chatTextarea = null;
          this.chatMessages = null;
          this.sendButton = null;
          this.closeButton = null;
          this.clearButton = null;
          this.assistantToggle = null;
          this.isOpen = false;
          this.conversationHistory = [];
          this.isGenerating = false;
          this.currentConversationId = null;
          this.savedConversations = [];
          this.uploadedFiles = [];
          this.availableModels = [];
          this.currentModel = "openai";
          
          this.init();
        }

        init() {
          this.createUI();
          this.setupEventListeners();
          this.loadConversationHistory();
          this.loadSavedConversations();
          this.fetchAvailableModels();
        }

        createUI() {
          this.chatContainer = document.createElement('div');
          this.chatContainer.className = 'rr-assistant-container';
          this.chatContainer.style.display = 'none';
          
          const header = document.createElement('div');
          header.className = 'rr-assistant-header';
          header.innerHTML = `
            <h3><i class="fab fa-linux"></i> RR Assistant</h3>
            <div class="rr-assistant-header-actions">
              <button class="rr-assistant-new-chat" title="New Chat"><i class="fas fa-plus"></i></button>
              <button class="rr-assistant-clear-chat" title="Clear Chat"><i class="fas fa-eraser"></i></button>
              <button class="rr-assistant-save-chat" title="Saved Chats"><i class="fas fa-save"></i></button>
            </div>
          `;
          
          this.closeButton = document.createElement('button');
          this.closeButton.className = 'rr-assistant-close';
          this.closeButton.innerHTML = '<i class="fas fa-times"></i>';
          header.appendChild(this.closeButton);
          
          this.chatMessages = document.createElement('div');
          this.chatMessages.className = 'rr-assistant-messages';
          
          const inputContainer = document.createElement('div');
          inputContainer.className = 'rr-assistant-input-container';

          const fileInputContainer = document.createElement('div');
          fileInputContainer.className = 'rr-assistant-file-input-container';
          
          const uploadButton = document.createElement('button');
          uploadButton.className = 'rr-assistant-upload';
          uploadButton.innerHTML = '<i class="fas fa-paperclip"></i>';
          uploadButton.title = 'Attach file';
          
          const fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.multiple = true;
          fileInput.accept = 'image/*,.pdf,.txt,.doc,.docx';
          fileInput.style.display = 'none';
          
          const imagePreview = document.createElement('div');
          imagePreview.className = 'rr-assistant-image-preview';
          
          this.chatTextarea = document.createElement('textarea');
          this.chatTextarea.className = 'rr-assistant-textarea';
          this.chatTextarea.placeholder = 'Ask me anything or upload a file...';
          this.chatTextarea.rows = 1;
          
          const sendButtonContainer = document.createElement('div');
          sendButtonContainer.className = 'rr-assistant-send-container';
          
          this.sendButton = document.createElement('button');
          this.sendButton.className = 'rr-assistant-send';
          this.sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
          this.sendButton.disabled = true;
          
          fileInputContainer.appendChild(uploadButton);
          fileInputContainer.appendChild(fileInput);
          
          sendButtonContainer.appendChild(this.sendButton);
          
          inputContainer.appendChild(fileInputContainer);
          inputContainer.appendChild(imagePreview);
          inputContainer.appendChild(this.chatTextarea);
          inputContainer.appendChild(sendButtonContainer);
          
          this.chatContainer.appendChild(header);
          this.chatContainer.appendChild(this.chatMessages);
          this.chatContainer.appendChild(inputContainer);
          
          document.body.appendChild(this.chatContainer);
          
          this.clearButton = this.chatContainer.querySelector('.rr-assistant-clear-chat');
          this.fileInput = fileInput;
          this.imagePreview = imagePreview;
        }

        async fetchAvailableModels() {
          try {
            const response = await fetch('https://text.pollinations.ai/models');
            if (!response.ok) {
              throw new Error('Failed to fetch models');
            }
            this.availableModels = await response.json();
          } catch (error) {
            console.error('Error fetching models:', error);
            this.showNotification('Failed to load models. Using default.');
            this.availableModels = [{ id: 'openai', name: 'OpenAI (Default)' }];
          }
        }

        setupEventListeners() {
          this.closeButton.addEventListener('click', () => this.toggleChat());
          
          this.chatTextarea.addEventListener('input', () => {
            this.sendButton.disabled = this.chatTextarea.value.trim() === '' && this.uploadedFiles.length === 0;
            this.adjustTextareaHeight();
          });
          
          this.chatTextarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (!this.sendButton.disabled) {
                this.sendMessage();
              }
            }
          });
          
          this.sendButton.addEventListener('click', () => this.sendMessage());
          this.clearButton.addEventListener('click', () => this.clearCurrentConversation());
          
          const newChatButton = this.chatContainer.querySelector('.rr-assistant-new-chat');
          newChatButton.addEventListener('click', () => this.startNewConversation());
          
          const saveChatButton = this.chatContainer.querySelector('.rr-assistant-save-chat');
          saveChatButton.addEventListener('click', () => {
            this.saveCurrentConversation();
            this.showSavedConversations();
          });
          
          const uploadButton = this.chatContainer.querySelector('.rr-assistant-upload');
          uploadButton.addEventListener('click', () => this.fileInput.click());
          
          this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }

        adjustTextareaHeight() {
          this.chatTextarea.style.height = 'auto';
          this.chatTextarea.style.height = `${Math.min(this.chatTextarea.scrollHeight, 120)}px`;
        }

        toggleChat() {
          this.isOpen = !this.isOpen;
          this.chatContainer.style.display = this.isOpen ? 'flex' : 'none';
          
          if (this.isOpen) {
            this.chatTextarea.focus();
            this.scrollToBottom();
          }
        }

        scrollToBottom() {
          if (this.chatMessages) {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
          }
        }

        async handleFileUpload(event) {
          const files = Array.from(event.target.files);
          if (files.length === 0) return;
          
          this.uploadedFiles = [];
          this.imagePreview.innerHTML = '';
          this.imagePreview.style.display = 'none';
          
          for (const file of files) {
            if (file.size > 5 * 1024 * 1024) {
              this.showNotification('File too large (max 5MB)');
              continue;
            }
            
            this.uploadedFiles.push(file);
            
            if (file.type.startsWith('image/')) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'rr-assistant-preview-item';
                imgContainer.innerHTML = `<img src="${e.target.result}" class="rr-assistant-preview-img"><button class="rr-assistant-cancel-image"><i class="fas fa-times"></i></button>`;
                imgContainer.querySelector('.rr-assistant-cancel-image').onclick = () => this.removeUploadedFile(file);
                this.imagePreview.appendChild(imgContainer);
                this.imagePreview.style.display = 'flex';
              };
              reader.readAsDataURL(file);
            }
          }
          
          if (this.uploadedFiles.length > 0) {
            this.sendButton.disabled = false;
            this.showNotification(`${this.uploadedFiles.length} file(s) ready`);
          }
          this.fileInput.value = '';
        }

        removeUploadedFile(fileToRemove) {
          this.uploadedFiles = this.uploadedFiles.filter(f => f !== fileToRemove);
          this.handleFileUpload({ target: { files: this.uploadedFiles } });
        }

        async sendMessage() {
            if (this.isGenerating) return;

            const message = this.chatTextarea.value.trim();
            const hasFiles = this.uploadedFiles.length > 0;

            if (!message && !hasFiles) return;

            this.isGenerating = true;
            this.sendButton.disabled = true;

            if (message) this.addMessage('user', message);

            if (hasFiles) {
                const fileMessage = `Analyzing ${this.uploadedFiles.length} file(s): ${this.uploadedFiles.map(f => f.name).join(', ')}`;
                this.addMessage('user', fileMessage, true);
            }

            this.chatTextarea.value = '';
            this.adjustTextareaHeight();
            this.imagePreview.innerHTML = '';
            this.imagePreview.style.display = 'none';

            const thinkingId = this.addMessage('assistant', 'Thinking...', true);
            
            if (!this.currentConversationId) {
                this.currentConversationId = 'conv-' + Date.now();
            }

            const currentMsgs = this.getCurrentMessages();
            if(message) currentMsgs.push({ role: 'user', content: message });

            try {
                if (hasFiles) {
                    const content = [{ type: "text", text: message }];
                    for (const file of this.uploadedFiles) {
                        const base64Image = await this.fileToBase64(file);
                        content.push({ type: "image_url", image_url: { url: base64Image } });
                    }
                    currentMsgs.pop(); 
                    currentMsgs.push({ role: 'user', content });
                }

                await this.streamChatCompletion(currentMsgs, thinkingId);

                const finalResponse = document.getElementById(thinkingId)?.querySelector('.rr-assistant-content')?.textContent || '';
                this.conversationHistory.push({ conversationId: this.currentConversationId, role: 'user', content: message });
                this.conversationHistory.push({ conversationId: this.currentConversationId, role: 'assistant', content: finalResponse, timestamp: new Date().toISOString() });
                this.saveConversationHistory();
            } catch (error) {
                console.error('Error:', error);
                this.updateMessage(thinkingId, 'Sorry, I encountered an error.');
            } finally {
                this.isGenerating = false;
                this.uploadedFiles = [];
            }
        }

        async streamChatCompletion(messages, thinkingId) {
            const url = "/api/proxy";
            // ✅ PERBAIKAN: Gunakan 'openai' sebagai nama model
            const payload = { model: "openai", messages, stream: true };

            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Accept": "text/event-stream" },
                    body: JSON.stringify(payload)
                });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = "";
                let firstChunk = true;

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n\n");
                    buffer = lines.pop();

                    for (const line of lines) {
                        if (line.startsWith("data: ")) {
                            const dataStr = line.substring(6).trim();
                            if (dataStr === "[DONE]") continue;
                            try {
                                const chunk = JSON.parse(dataStr);
                                const content = chunk?.choices?.[0]?.delta?.content;
                                if (content) {
                                    if (firstChunk) {
                                        this.updateMessage(thinkingId, content, true);
                                        firstChunk = false;
                                    } else {
                                        this.updateMessage(thinkingId, content, false);
                                    }
                                }
                            } catch (e) { console.error("Stream parse error:", e); }
                        }
                    }
                }
            } catch (error) {
                console.error("Streaming error:", error);
                this.updateMessage(thinkingId, "Error fetching response.", true);
            }
        }

        fileToBase64(file) {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
        }
        
        addMessage(role, content, isSystem = false) {
            const messageId = 'msg-' + Date.now() + Math.random();
            const messageElement = document.createElement('div');
            messageElement.className = `rr-assistant-message ${role}-message ${isSystem ? 'system-message' : ''}`;
            messageElement.id = messageId;
            
            const avatar = document.createElement('div');
            avatar.className = 'rr-assistant-avatar';
            avatar.innerHTML = role === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

            const contentContainer = document.createElement('div');
            contentContainer.className = 'rr-assistant-content-container';

            const contentElement = document.createElement('div');
            contentElement.className = 'rr-assistant-content';
            contentElement.textContent = content;

            if (role === 'assistant' && !isSystem) {
                const copyButton = document.createElement('button');
                copyButton.className = 'rr-assistant-copy-btn';
                copyButton.title = 'Copy';
                copyButton.innerHTML = '<i class="far fa-copy"></i>';
                copyButton.onclick = () => this.copyToClipboard(content);
                contentContainer.appendChild(copyButton);
            }
            
            contentContainer.appendChild(contentElement);
            messageElement.appendChild(avatar);
            messageElement.appendChild(contentContainer);
            this.chatMessages.appendChild(messageElement);
            this.scrollToBottom();
            return messageId;
        }

        updateMessage(id, newContent, overwrite = false) {
          const messageElement = document.getElementById(id);
          if (messageElement) {
            const contentElement = messageElement.querySelector('.rr-assistant-content');
            if (contentElement) {
              if (messageElement.classList.contains('thinking')) {
                messageElement.classList.remove('thinking');
              }
              if (overwrite) {
                contentElement.textContent = newContent;
              } else {
                contentElement.textContent += newContent;
              }
            }
          }
        }

        copyToClipboard(text) {
          navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Copied to clipboard!');
          }).catch(err => {
            console.error('Failed to copy:', err);
            this.showNotification('Failed to copy.');
          });
        }

        getCurrentMessages() {
          return this.conversationHistory
            .filter(msg => msg.conversationId === this.currentConversationId)
            .map(({ role, content }) => ({ role, content }));
        }

        saveConversationHistory() {
          localStorage.setItem('rrAssistantHistory', JSON.stringify(this.conversationHistory));
        }

        loadConversationHistory() {
          const savedHistory = localStorage.getItem('rrAssistantHistory');
          if (savedHistory) {
            try {
              this.conversationHistory = JSON.parse(savedHistory);
            } catch (e) { console.error('Failed to load history:', e); }
          }
          this.startNewConversation();
        }

        loadSavedConversations() {
          const saved = localStorage.getItem('rrAssistantSavedConversations');
          if (saved) {
            try {
              this.savedConversations = JSON.parse(saved) || [];
            } catch (e) { console.error('Failed to load saved chats:', e); }
          }
        }

        saveCurrentConversation() {
          const messagesInConv = this.conversationHistory.filter(msg => msg.conversationId === this.currentConversationId);
          if (messagesInConv.length === 0) {
            this.showNotification('Nothing to save!');
            return;
          }
          const conversation = {
            id: this.currentConversationId,
            title: messagesInConv[0]?.content.substring(0, 30) || `Chat ${new Date().toLocaleDateString()}`,
            messages: messagesInConv,
            createdAt: new Date().toISOString()
          };
          
          this.savedConversations = this.savedConversations.filter(c => c.id !== conversation.id);
          this.savedConversations.unshift(conversation);
          localStorage.setItem('rrAssistantSavedConversations', JSON.stringify(this.savedConversations));
          this.showNotification('Conversation saved!');
        }

        showSavedConversations() {
            const modal = document.createElement('div');
            modal.className = 'rr-assistant-modal';
            modal.innerHTML = `<div class="rr-assistant-modal-content">...</div>`;
            document.body.appendChild(modal);
        }
        
        loadConversation(conversationId) {}

        deleteConversation(conversationId) {}
        
        clearCurrentConversation() {
            if (!this.currentConversationId) return;
            this.conversationHistory = this.conversationHistory.filter(msg => msg.conversationId !== this.currentConversationId);
            this.saveConversationHistory();
            this.chatMessages.innerHTML = '';
            this.showNotification('Chat cleared.');
        }

        startNewConversation() {
          this.currentConversationId = 'conv-' + Date.now();
          this.chatMessages.innerHTML = '';
          this.addMessage('assistant', "Hello! How can I assist you today?", true);
        }

        showNotification(message) {
          const notification = document.createElement('div');
          notification.className = 'rr-assistant-notification';
          notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
          document.body.appendChild(notification);
          setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
          }, 2000);
        }
      }
      
      window.rrAssistantInstance = new RRAssistant();
    }
  }, []);

  return null;
};

export default ChatbotAssistant;