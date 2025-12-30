import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificateService } from '../../services/certificate.service';
import { Certificate } from '../../models/certificate.model';

@Component({
  selector: 'app-certificates-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 bg-white rounded-xl shadow">
      <h2 class="text-xl font-bold mb-4">My Certificates (mock)</h2>
      <div *ngIf="certs().length === 0" class="text-gray-500">No certificates yet</div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div *ngFor="let c of certs()" class="border rounded p-4">
          <div class="font-medium">{{ c.courseTitle }}</div>
          <div class="text-xs text-gray-500">Issued: {{ formatDate(c.issueDate) }}</div>
          <div class="mt-2">
            <button (click)="download(c.id)" class="text-sm text-blue-600">Download</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CertificatesComponent implements OnInit {
  private certService = inject(CertificateService);
  certs = signal<Certificate[]>([]);

  ngOnInit(): void {
    this.certService.loadCertificates().subscribe((c) => this.certs.set(c));
  }

  formatDate(d: Date): string {
    return new Date(d).toLocaleDateString();
  }

  download(id: string) {
    // hint: downloadCertificate triggers browser download in real implementation
    this.certService.downloadCertificate(id).subscribe(() => {
      console.log('mock download complete', id);
    });
  }
}
