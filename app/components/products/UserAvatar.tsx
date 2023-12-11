import Image from "next/image";
import Avatar from "@mui/material/Avatar";

interface UserAvatarProps {
  src?: string | null | undefined;
  name: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ src, name }) => {
  function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name: string) {
    if (!name) {
      // Handle cases where name is undefined
      return {};
    }

    const splitName = name.split(" ");

    if (splitName.length === 1) {
      // For single-word names, use the first two characters
      return {
        sx: {
          bgcolor: stringToColor(name),
        },
        children: `${name.substring(0, 2)}`,
      };
    }

    // For double-word names, use the first character of each word
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${splitName[0][0]}${splitName[1][0]}`,
    };
  }

  if (src) {
    return (
      <Image
        src={src}
        alt="Avatar"
        className="rounded-full"
        height="30"
        width="30"
      />
    );
  }
  return <Avatar {...stringAvatar(name)} />;
};

export default UserAvatar;
