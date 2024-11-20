import { ProfileDataModel } from "./profile.modal";
import { ProfileData } from "./profile.validation";

interface IProfileDataDal {
  upSertProfileData(data: ProfileData): Promise<ProfileData>;
}

export class ProfileDataDAL implements IProfileDataDal {
  async upSertProfileData(data: ProfileData): Promise<ProfileData> {
    return await ProfileDataModel.findOneAndUpdate({ userId: data.userId }, data, {
      upsert: true,
      new: true,
    });
  }
}
