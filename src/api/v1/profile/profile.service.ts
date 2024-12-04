import { ProfileDataDAL } from "./profile.dal";
import { ProfileDto } from "./profile.dto";
import { ProfileData, validateProfileSchema } from "./profile.validation";

export class ProfileService {
  private profileDataDal: ProfileDataDAL;

  constructor() {
    this.profileDataDal = new ProfileDataDAL();
  }

  upSertProfileData = async (data: ProfileData) => {
    const profileData = validateProfileSchema(data);
    const updatedProfileData = await this.profileDataDal.upSertProfileData(profileData);
    return ProfileDto(updatedProfileData).getProfile();
  };

  getProfileData = async (userId: string): Promise<ProfileData | null> => {
    return await this.profileDataDal.getProfileData(userId);
  };
}
