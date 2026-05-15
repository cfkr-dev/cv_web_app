export type ProjectParticipantStatus = "active" | "pending"
export type ProjectParticipantRole = "admin" | "collaborator"

export type ProjectParticipantRecord = {
  id: string
  userId: string
  status: ProjectParticipantStatus
  role: ProjectParticipantRole
}

export type ProjectParticipantTableRow = {
  id: string
  userId: string
  fullName: string
  status: ProjectParticipantStatus
  role: ProjectParticipantRole
}

export const fakeProjectParticipantRecords: ProjectParticipantRecord[] = [
  {
    id: "project-participant-1",
    userId: "participant-1",
    status: "active",
    role: "admin",
  },
  {
    id: "project-participant-2",
    userId: "participant-2",
    status: "active",
    role: "collaborator",
  },
  {
    id: "project-participant-3",
    userId: "participant-3",
    status: "pending",
    role: "collaborator",
  },
  {
    id: "project-participant-4",
    userId: "participant-4",
    status: "active",
    role: "admin",
  },
  {
    id: "project-participant-5",
    userId: "participant-5",
    status: "pending",
    role: "collaborator",
  },
  {
    id: "project-participant-6",
    userId: "participant-6",
    status: "active",
    role: "collaborator",
  },
  {
    id: "project-participant-7",
    userId: "participant-7",
    status: "pending",
    role: "collaborator",
  },
  {
    id: "project-participant-8",
    userId: "participant-8",
    status: "active",
    role: "admin",
  },
  {
    id: "project-participant-9",
    userId: "participant-9",
    status: "pending",
    role: "collaborator",
  },
  {
    id: "project-participant-10",
    userId: "participant-10",
    status: "active",
    role: "collaborator",
  },
  {
    id: "project-participant-11",
    userId: "participant-11",
    status: "pending",
    role: "collaborator",
  },
  {
    id: "project-participant-12",
    userId: "participant-12",
    status: "active",
    role: "admin",
  },
]
