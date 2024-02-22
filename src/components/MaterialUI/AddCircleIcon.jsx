import * as React from "react";
import Stack from "@mui/material/Stack";
import { green } from "@mui/material/colors";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";

export default function CustomeIcons(props) {
  return (
    <Stack>
      <Tooltip title="Create Playlist">
        <Icon
          sx={{ color: green[500], fontSize: 50, cursor: "pointer" }}
          onClick={props.onClick}
        >
          add_circle
        </Icon>
      </Tooltip>
    </Stack>
  );
}
{
  /* <Icon fontSize="small">add_circle</Icon>
      <Icon sx={{ fontSize: 30 }}>add_circle</Icon> */
}
{
  /* <Icon>add_circle</Icon>
      <Icon color="primary">add_circle</Icon> */
}
