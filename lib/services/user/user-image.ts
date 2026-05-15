const fakeUserImages: Record<string, string | null> = {
  "participant-1": "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png",
  "participant-2": "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png",
  "participant-3": "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png",
  "participant-4": "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-16.png",
  "participant-5": "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png",
  "participant-6": "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png",
  "participant-7": "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png",
  "participant-8": "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-8.png",
  "participant-9": null,
  "participant-10": null,
  "participant-11": null,
  "participant-12": null,
  "participant-13": null,
  "participant-14": null,
  "participant-15": null,
  "participant-16": null,
  "participant-17": null,
  "participant-18": null,
  "participant-19": null,
  "participant-20": null,
  "participant-21": null,
  "participant-22": null,
  "participant-23": null,
  "participant-24": null,
  "participant-25": null,
  "participant-26": null,
  "participant-27": null,
  "participant-28": null,
}

export function getUserImageById(userId: string) {
  return new Promise<string | null>((resolve) => {
    window.setTimeout(() => {
      resolve(fakeUserImages[userId] ?? null)
    }, 250)
  })
}
