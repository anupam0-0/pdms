import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FilterSelectMenu() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue  placeholder="Featured" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {/* <SelectLabel>Fruits</SelectLabel> */}
          <SelectItem value="featured">Featured</SelectItem>
          <SelectItem value="discount">Discount</SelectItem>
          <SelectItem value="a2z">Name: (A to Z)</SelectItem>
          <SelectItem value="z2a">Name: (A to Z)</SelectItem>
          <SelectItem value="l2h">Price: (low to high)</SelectItem>
          <SelectItem value="h2a">Price: (high to low)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
