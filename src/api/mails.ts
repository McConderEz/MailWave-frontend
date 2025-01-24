import { AxiosResponse } from "axios";
import { Envelope } from "../models/Envelope";
import { Letter } from "../models/Letter";
import { api } from "./api";

export class MailService {
  static async getMessagesFromFolderWithPagination(
    folder: number,
    page: number,
    pageSize: number
  ): Promise<AxiosResponse<Envelope<Letter[]>>> {
    return api.get<Envelope<Letter[]>>("Mail/", {
      params: {
        emailFolder: folder,
        page: page,
        pageSize: pageSize,
      },
    });
  }
}
