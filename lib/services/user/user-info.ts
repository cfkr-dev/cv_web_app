import type { UserInfo } from "@/features/user/image/simple/types/user-image"

const fakeUsers: Record<string, UserInfo> = {
  "participant-1": { id: "participant-1", name: "Olivia", surname: "Sparks" },
  "participant-2": { id: "participant-2", name: "Howard", surname: "Lloyd" },
  "participant-3": { id: "participant-3", name: "Hallie", surname: "Richards" },
  "participant-4": { id: "participant-4", name: "Jenny", surname: "Wilson" },
  "participant-5": { id: "participant-5", name: "Darlene", surname: "Robertson" },
  "participant-6": { id: "participant-6", name: "Leslie", surname: "Alexander" },
  "participant-7": { id: "participant-7", name: "Courtney", surname: "Henry" },
  "participant-8": { id: "participant-8", name: "Jacob", surname: "Jones" },
  "participant-9": { id: "participant-9", name: "Ava", surname: "Carter" },
  "participant-10": { id: "participant-10", name: "Mason", surname: "Reed" },
  "participant-11": { id: "participant-11", name: "Mila", surname: "Bennett" },
  "participant-12": { id: "participant-12", name: "Leo", surname: "Turner" },
  "participant-13": { id: "participant-13", name: "Nora", surname: "Mitchell" },
  "participant-14": { id: "participant-14", name: "Ethan", surname: "Brooks" },
  "participant-15": { id: "participant-15", name: "Lily", surname: "Foster" },
  "participant-16": { id: "participant-16", name: "Lucas", surname: "Perry" },
  "participant-17": { id: "participant-17", name: "Zoe", surname: "Bennett" },
  "participant-18": { id: "participant-18", name: "Noah", surname: "Hayes" },
  "participant-19": { id: "participant-19", name: "Emma", surname: "Stone" },
  "participant-20": { id: "participant-20", name: "Jack", surname: "Porter" },
  "participant-21": { id: "participant-21", name: "Iris", surname: "Cole" },
  "participant-22": { id: "participant-22", name: "Owen", surname: "Gray" },
  "participant-23": { id: "participant-23", name: "Chloe", surname: "Price" },
  "participant-24": { id: "participant-24", name: "Ryan", surname: "Bell" },
  "participant-25": { id: "participant-25", name: "Sara", surname: "Wood" },
  "participant-26": { id: "participant-26", name: "Daniel", surname: "King" },
  "participant-27": { id: "participant-27", name: "Maya", surname: "Scott" },
  "participant-28": { id: "participant-28", name: "Adam", surname: "Price" },
}

export function getUserInfoById(userId: string) {
  return new Promise<UserInfo>((resolve, reject) => {
    window.setTimeout(() => {
      const user = fakeUsers[userId]

      if (!user) {
        reject(new Error(`User ${userId} not found`))
        return
      }

      resolve(user)
    }, 250)
  })
}
