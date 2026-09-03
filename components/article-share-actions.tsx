"use client";

import { ShareActions } from "@/components/share-actions";

type Props = {
  url: string;
  title: string;
  description?: string;
  mode?: "rail" | "inline";
};

export function ArticleShareActions({ url, title, description = "", mode = "rail" }: Props) {
  return <ShareActions url={url} title={title} description={description} source="article" mode={mode} />;
}
