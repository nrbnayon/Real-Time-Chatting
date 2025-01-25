type IFolderName = 'image' | 'media' | 'doc' | 'images' | 'medias' | 'docs';

export const getFilePathMultiple = (
  files: any,
  fieldname: any,
  folderName: IFolderName
) => {
  let value: any;
  Object.entries(files).forEach(([key, _value]: any) => {
    if (fieldname === key) {
      value = _value.map((v: any) => `/${folderName}s/${v.filename}`);
    }
  });

  return value;
};

const getFilePath = (files: any, folderName: IFolderName) => {
  if (files && files.image[0].fieldname in files && files.image[0]) {
    return `/${folderName}/${files.image[0].filename}`;
  }
  return null;
};

export default getFilePath;
