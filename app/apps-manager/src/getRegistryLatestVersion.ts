export const registryUrl = `https://registry.tryorbit.com`
export const apiUrl = `https://tryorbit.com/api`

export const getRegistryLatestVersion = async (packageId: string) => {
  const info = await getRegistryInfo(packageId)
  return `${info['dist-tags'].latest}`
}

export const getRegistryInfo = (packageId: string) =>
  fetch(`${registryUrl}/${packageId}`).then(x => x.json())
