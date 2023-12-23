declare interface Notes {
  id: number
  title: string
  user_id: string
  created_at?: Date
  modified_at?: Date
  content?: string
  directory?: string
  metadata?: any
  hash?: string
}

declare interface NoteInfo {
  id: number
  title: string
  modifiedAt: Date
}