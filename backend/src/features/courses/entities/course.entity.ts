import { Entity } from 'typeorm'

import { BaseEntity } from '@/common/entities/base.entity'

/**
 * Curso do catálogo. Por enquanto só carrega os campos herdados de
 * BaseEntity (id, name, description, createdAt, updatedAt) — nada
 * específico da feature ainda.
 */
@Entity('courses')
export class Course extends BaseEntity {}
