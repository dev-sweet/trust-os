import { useMutation } from "@tanstack/react-query";
import { uploadPhoto } from "../services/upload.services";

export const useUploadPhoto = () => {
  return useMutation({
    mutationFn: uploadPhoto,
  });
};
