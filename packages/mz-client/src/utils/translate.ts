import { englishRegionName, regionCategoryList } from "@/lib/const";
import { EnglishRegionNameType, RegionCategoryTypeWithAll } from "@/types/db";

export function koreanToEnglish(korean: RegionCategoryTypeWithAll) {
  return englishRegionName[korean];
}

export function englishToKorean(english: EnglishRegionNameType) {
  const koreanRegionName = Object.fromEntries(
    Object.entries(englishRegionName).map(([ko, en]) => [
      en as EnglishRegionNameType,
      ko as RegionCategoryTypeWithAll,
    ])
  );

  return koreanRegionName[english];
}

export function getRegionIndex(english: EnglishRegionNameType) {
  const korean = englishToKorean(english);
  return ["전체", ...regionCategoryList].indexOf(korean);
}
