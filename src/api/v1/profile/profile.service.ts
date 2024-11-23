import { ErrorTypeEnum } from "../../../constants";
import { ProfileDataDAL } from "./profile.dal";
import { ProfileData, validateProfileSchema } from "./profile.validation";

export class ProfileService {
  private profileDataDal: ProfileDataDAL;

  constructor() {
    this.profileDataDal = new ProfileDataDAL();
  }

  upSertProfileData = async (data: ProfileData) => {
    const profileData = validateProfileSchema(data);

    const updateProfileData = await this.profileDataDal.upSertProfileData(profileData);
    // return ProfileDto(updateProfileData).getProfile();
    return updateProfileData;
  };

  getProfileData = async (userId: string) => {
    const profileData = await this.profileDataDal.getProfileData(userId);

    if (!profileData) {
      throw new Error(ErrorTypeEnum.enum.RESOURCE_NOT_FOUND);
    }

    return profileData;
  };
}
