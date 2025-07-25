import { useFile } from './hooks'
import { useStore } from './store'
import type { FileUpload } from './types'
import { FILE_EXTS } from './constants'
import { SupportUploadFileTypes } from './types'

type FileInputProps = {
  fileConfig: FileUpload
}
const FileInput = ({
  fileConfig,
}: FileInputProps) => {
  const files = useStore(s => s.files)
  const { handleLocalFileUpload } = useFile(fileConfig)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetFiles = e.target.files

    if (targetFiles) {
      if (fileConfig.number_limits) {
        for (let i = 0; i < targetFiles.length; i++) {
          if (i + 1 + files.length <= fileConfig.number_limits)
            handleLocalFileUpload(targetFiles[i])
        }
      }
      else {
        handleLocalFileUpload(targetFiles[0])
      }
    }
  }

  const allowedFileTypes = fileConfig.allowed_file_types
  const isCustom = allowedFileTypes?.includes(SupportUploadFileTypes.custom)
  const exts = isCustom ? (fileConfig.allowed_file_extensions || []) : (allowedFileTypes?.map(type => FILE_EXTS[type]) || []).flat().map(item => `.${item}`)
  const accept = exts.join(',')

  return (
    <input
      className='absolute inset-0 block w-full cursor-pointer text-[0] opacity-0 disabled:cursor-not-allowed'
      onClick={e => ((e.target as HTMLInputElement).value = '')}
      type='file'
      onChange={handleChange}
      accept={accept}
      disabled={!!(fileConfig.number_limits && files.length >= fileConfig?.number_limits)}
      multiple={!!fileConfig.number_limits && fileConfig.number_limits > 1}
    />
  )
}

export default FileInput
