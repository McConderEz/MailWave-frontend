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

  static async getMessagesCountFromFolder(
    folder: number
  ): Promise<AxiosResponse<Envelope<number>>> {
    return api.get<Envelope<number>>("Mail/messages-count", {
      params: {
        selectedFolder: folder,
      },
    });
  }

  static async getMessageFromFolderById(
    messageId: number,
    emailFolder: number
  ): Promise<AxiosResponse<Envelope<Letter>>> {
    return api.get<Envelope<Letter>>(
      `Mail/${messageId}/message-from-folder-by-id`,
      {
        params: {
          emailFolder: emailFolder,
        },
      }
    );
  }
}
