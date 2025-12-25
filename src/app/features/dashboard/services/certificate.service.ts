import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Certificate } from '../models/certificate.model';

@Injectable({
  providedIn: 'root',
})
export class CertificateService {
  private readonly apiUrl = '/api/certificates';

  private certificatesSubject = new BehaviorSubject<Certificate[]>([]);
  readonly certificates$ = this.certificatesSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Load all certificates for the current user
   */
  loadCertificates(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(this.apiUrl).pipe(
      tap((certs) => this.certificatesSubject.next(certs)),
      map((certs: any[]) =>
        certs.map(
          (cert: { issueDate: string | number | Date; expiryDate: string | number | Date }) => ({
            ...cert,
            issueDate: new Date(cert.issueDate),
            expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : undefined,
          })
        )
      )
    );
  }

  /**
   * Get a specific certificate
   */
  getCertificate(certificateId: string): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.apiUrl}/${certificateId}`);
  }

  /**
   * Download certificate as PDF
   */
  downloadCertificate(certificateId: string): Observable<Blob> {
    return this.http
      .get(`${this.apiUrl}/${certificateId}/download`, {
        responseType: 'blob',
      })
      .pipe(
        tap((blob) => {
          // TODO: Trigger download in browser
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `certificate-${certificateId}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        })
      );
  }

  /**
   * Get certificate by course ID
   */
  getCertificateByCourse(courseId: string): Observable<Certificate | null> {
    return this.http.get<Certificate | null>(`${this.apiUrl}/course/${courseId}`);
  }

  /**
   * Verify certificate authenticity
   */
  verifyCertificate(credentialId: string): Observable<{
    isValid: boolean;
    certificate?: Certificate;
  }> {
    return this.http.get<any>(`${this.apiUrl}/verify/${credentialId}`);
  }

  /**
   * Share certificate (get shareable link)
   */
  shareCertificate(certificateId: string): Observable<{ shareUrl: string }> {
    return this.http.post<{ shareUrl: string }>(`${this.apiUrl}/${certificateId}/share`, {});
  }

  /**
   * Get certificate statistics
   */
  getCertificateStats(): Observable<{
    totalEarned: number;
    recentCertificates: Certificate[];
    expiringCertificates: Certificate[];
  }> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }
}
