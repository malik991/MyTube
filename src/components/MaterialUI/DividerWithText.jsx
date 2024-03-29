import * as React from "react";
import { styled } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  "& > :not(style) ~ :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export default function DividerText({ text, label }) {
  const content = <p>{text}</p>;

  return (
    <Root>
      {content}
      <Divider>
        <Chip label={label} size="small" />
      </Divider>
    </Root>
  );
}

export function SimpleDividerLine({ labelText }) {
  return (
    <Root>
      <Divider>
        <Chip label={labelText} size="small" />
      </Divider>
    </Root>
  );
}
