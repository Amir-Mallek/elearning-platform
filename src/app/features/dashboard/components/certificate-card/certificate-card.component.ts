import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Certificate } from '../../models/certificate.model';

@Component({
  selector: 'app-certificate-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificate-card.component.html',
})
export class CertificateCardComponent {
  @Input() certificate!: Certificate;
  @Output() download = new EventEmitter<void>();
  @Output() share = new EventEmitter<void>();

  onDownload(): void {
    this.download.emit();
  }

  onShare(): void {
    this.share.emit();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  isExpired(): boolean {
    if (!this.certificate.expiryDate) return false;
    return new Date(this.certificate.expiryDate) < new Date();
  }
}
