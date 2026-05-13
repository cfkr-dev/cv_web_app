export type IntroductionData = {
  name: string
  surname: string
  location: string
  postalCode: string
  phone: string
  email: string
}

const introductionData: IntroductionData = {
  name: "Alberto",
  surname: "Perez Perez",
  location: "Madrid",
  postalCode: "28001",
  phone: "+34 612 345 678",
  email: "alberto@myworkspace.dev",
}

export async function getIntroduction() {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })

  return {
    ...introductionData,
  }
}
