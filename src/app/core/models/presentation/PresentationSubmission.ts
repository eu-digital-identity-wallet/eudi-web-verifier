export type PresentationSubmission = {
  id: string,
  definition_id: string,
  descriptor_map: DescriptorMap[]
}

export type DescriptorMap = {
  id: string,
  format: string,
  path: string
}
