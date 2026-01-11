import { List, ListItem, ListItemDecorator, Radio, RadioGroup } from "@mui/joy";
import { Banknote, CreditCard } from "lucide-react";

interface Props {
  value: string;
  onChange: (e: any) => void;
}
export default function PaymentMethod({ value, onChange }: Props) {
  return (
    <RadioGroup value={value} onChange={onChange}>
      <List
        orientation="horizontal"
        sx={{
          minWidth: "100%",
          width: "100%",
          "--List-gap": "0.5rem",
          "--ListItem-paddingY": "1rem",
          "--ListItem-radius": "8px",
          "--ListItemDecorator-size": "32px",
          backgroundColor: "tranparent",
          "& > *": {
            flex: 1, // Memastikan setiap ListItem mengambil ruang yang sama (full width)
          },
        }}
      >
        {["CASH", "TRANSFER"].map((item, index) => (
          <ListItem key={item} sx={{ boxShadow: "sm" }} variant="outlined">
            <ListItemDecorator>
              {[<Banknote key="CASH" />, <CreditCard key="TRANSFER" />][index]}
            </ListItemDecorator>
            <Radio
              overlay
              label={item}
              slotProps={{
                action: ({ checked }) => ({
                  sx: (theme) => ({
                    ...(checked && {
                      inset: -1,
                      border: "2px solid",
                      borderColor: theme.vars.palette.primary[500],
                    }),
                  }),
                }),
              }}
              sx={{
                flexGrow: 1,
                flexDirection: "row-reverse",
                justifyContent: "space-between",
              }}
              value={item}
            />
          </ListItem>
        ))}
      </List>
    </RadioGroup>
  );
}
