import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { Certificate } from '../models/certificate.model';

@Injectable({
  providedIn: 'root',
})
export class CertificateService {
  private certificatesSubject = new BehaviorSubject<Certificate[]>([]);
  readonly certificates$ = this.certificatesSubject.asObservable();

  constructor() {}

  // Return mocked certificates for UI/testing
  loadCertificates(): Observable<Certificate[]> {
    const mock: Certificate[] = [
      {
        id: 'cert1',
        userId: 'u1',
        courseId: 'c3',
        courseTitle: 'CSS for Developers',
        instructorName: 'Alice Lee',
        issueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
        credentialId: 'ABC-123',
        certificateUrl: '#',
        thumbnailUrl: 'https://picsum.photos/seed/cert1/600/400',
        verificationUrl: '#',
        expiryDate: undefined,
        grade: 92,
        skills: ['CSS', 'Responsive Design'],
      },
      {
        id: 'cert2',
        userId: 'u1',
        courseId: 'c4',
        courseTitle: 'HTML Advanced',
        instructorName: 'Bob',
        issueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
        credentialId: 'DEF-456',
        certificateUrl: '#',
        thumbnailUrl: 'https://picsum.photos/seed/cert2/600/400',
        verificationUrl: '#',
        expiryDate: undefined,
        grade: 88,
        skills: ['HTML', 'Accessibility'],
      },
    ];

    // simulate network latency and push into subject
    return of(mock).pipe(
      delay(150),
      tap((certs) => this.certificatesSubject.next(certs))
    );
  }

  // Keep an API-compatible method for download — returns a Blob (mock) and triggers browser download
  downloadCertificate(certificateId: string): Observable<Blob> {
    const blob = new Blob([`Certificate PDF content for ${certificateId}`], {
      type: 'application/pdf',
    });

    return of(blob).pipe(
      delay(100),
      tap((b) => {
        // optional: trigger client download (useful for UI testing)
        try {
          const url = window.URL.createObjectURL(b);
          const a = document.createElement('a');
          a.href = url;
          a.download = `certificate-${certificateId}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        } catch {
          // ignore in non-browser environments
        }
      })
    );
  }

  getCertificate(certificateId: string): Observable<Certificate | null> {
    const current = this.certificatesSubject.value.find((c) => c.id === certificateId) ?? null;
    return of(current).pipe(delay(50));
  }

  // Helper to add certificates during UI testing
  addMockCertificate(cert: Certificate): void {
    const next = [...this.certificatesSubject.value, cert];
    this.certificatesSubject.next(next);
  }
}
