/**
 * Servicio de Aplicaciones
 * Gestiona las operaciones relacionadas con aplicaciones del sistema
 */

import httpService from './http'
import type { Application } from '@/stores/applications'

export class ApplicationsService {
  /**
   * Obtener todas las aplicaciones públicas (marketplace)
   * Endpoint: GET /applications
   */
  static async getAllApplications(): Promise<Application[]> {
    return await httpService.get<Application[]>('/applications')
  }

  /**
   * Obtener una aplicación por ID
   * Endpoint: GET /applications/:id
   */
  static async getApplication(id: string): Promise<Application> {
    return await httpService.get<Application>(`/applications/${id}`)
  }

  /**
   * Obtener una aplicación por slug
   * Endpoint: GET /applications/slug/:slug
   */
  static async getApplicationBySlug(slug: string): Promise<Application> {
    return await httpService.get<Application>(`/applications/slug/${slug}`)
  }

  /**
   * Obtener las aplicaciones del usuario actual (desde su cuenta)
   * Endpoint: GET /accounts/applications
   */
  static async getUserApplications(): Promise<any[]> {
    return await httpService.get<any[]>('/accounts/applications')
  }
}

export default ApplicationsService
