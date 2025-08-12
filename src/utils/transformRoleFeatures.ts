/* eslint-disable @typescript-eslint/no-explicit-any */
import { TRoleFeature } from "@/types/auth.types";
import {
  IconDashboard,
  IconSettings,
  IconAddressBook,
  IconUsers,
  IconHeartHandshake,
  IconDeviceDesktopCog,
  IconUserHeart,
  IconFileDescription,
  IconListDetails,
  IconMoneybag,
  IconCashRegister,
} from "@tabler/icons-react";

const iconMap: Record<string, any> = {
  dashboard: IconDashboard,
  campaigns: IconFileDescription,
  settings: IconSettings,
  profile: IconAddressBook,
  donors: IconUserHeart,
  volunteer: IconUsers,
  events: IconListDetails,
  partnership: IconHeartHandshake,
  management: IconDeviceDesktopCog,
  blogs: IconFileDescription,
  contacts: IconCashRegister,
  donations: IconMoneybag,
};

export function transformRoleFeatures(features: TRoleFeature[] | undefined) {
  const navMain = [];
  const navSecondary = [];

  for (const feature of features || []) {
    const { name, path } = feature;
    const item = {
      title: name,
      url: `
        ${feature.name === "Overview" ? `/${path}` : `/dashboard/${path}`}
      `,
      icon: iconMap[path] || IconUsers,
    };

    if (["settings", "profile"].includes(path)) {
      navSecondary.push(item);
    } else {
      navMain.push(item);
    }
  }

  return { navMain, navSecondary };
}
