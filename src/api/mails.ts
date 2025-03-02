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

  static async getSavedMessagesFromDatabaseWithPagination(
    page: number,
    pageSize: number
  ): Promise<AxiosResponse<Envelope<Letter[]>>> {
    return api.get<Envelope<Letter[]>>("Mail/saved-messages", {
      params: {
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

  static async getSavedMessageFromDatabaseById(
    messageId: number
  ): Promise<AxiosResponse<Envelope<Letter>>> {
    return api.get<Envelope<Letter>>(`Mail/${messageId}/saved-message`);
  }

  static async getCryptedAndSignedMessageFromFolderById(
    messageId: number,
    emailFolder: number
  ): Promise<AxiosResponse<Envelope<Letter>>> {
    return api.get<Envelope<Letter>>(
      `Mail/${messageId}/crypted-signed-message-from-folder-by-id`,
      {
        params: {
          emailFolder: emailFolder,
        },
      }
    );
  }

  static async verificationMessage(
    messageId: number,
    emailFolder: number
  ): Promise<AxiosResponse<Envelope<string>>> {
    return api.post<Envelope<string>>(
      `Mail/verification-message`,
      {
        EmailFolder: emailFolder,
        MessageId: messageId,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }

  static async deleteMessage(
    messageId: number,
    emailFolder: number
  ): Promise<AxiosResponse<void>> {
    return api.post<void>(
      `Mail/${messageId}/deletion-message`,
      {
        EmailFolder: emailFolder,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }

  static async saveMessage(
    messageIds: number[],
    emailFolder: number
  ): Promise<AxiosResponse<void>> {
    return api.post<void>(
      `Mail/saving-message`,
      {
        EmailFolder: emailFolder,
        MessageIds: messageIds,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }

  static async saveFile(
    directoryPath: string,
    fileName: string,
    messageId: number,
    emailFolder: number
  ): Promise<AxiosResponse<void>> {
    return api.post<void>(
      `Mail/saving-files`,
      {
        DirectoryPath: directoryPath,
        EmailFolder: emailFolder,
        MessageId: messageId,
        FileName: fileName,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }

  static async sendFriendRequest(
    receiver: string
  ): Promise<AxiosResponse<void>> {
    return api.post<void>(`Mail/sending-friend-request`, {
      Receiver: receiver,
    });
  }

  static async acceptFriendship(
    messageId: number,
    emailFolder: number
  ): Promise<AxiosResponse<void>> {
    return api.post<void>(
      `Mail/accepting-friend-request`,
      {
        EmailFolder: emailFolder,
        MessageId: messageId,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }

  static async SendMessage(form: FormData): Promise<AxiosResponse<void>> {
    return api.post<void>(`Mail`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  static async SendCryptedAndSignedMessage(
    form: FormData
  ): Promise<AxiosResponse<void>> {
    return api.post<void>(`Mail/sending-crypted-and-signed-message`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  static async SendScheduledMessage(
    form: FormData
  ): Promise<AxiosResponse<void>> {
    return api.post<void>(`Mail/scheduled-message`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  static async MoveMessage(
    messageId: number,
    form: FormData
  ): Promise<AxiosResponse<void>> {
    return api.post<void>(`Mail/${messageId}`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}
