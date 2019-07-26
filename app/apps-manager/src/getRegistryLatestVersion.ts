export const registryUrl = false ? `http://example.com` : `https://registry.tryorbit.com`

export const apiUrl = false
  ? `http://localhost:5000/orbit-3b7f1/us-central1/search`
  : `https://tryorbit.com/api`

export const getRegistryLatestVersion = async (packageId: string) => {
  const info = await getRegistryInfo(packageId)
  return `${info['dist-tags'].latest}`
}

export const getRegistryInfo = (packageId: string) =>
  fetch(`${registryUrl}/${packageId}`).then(x => x.json())
