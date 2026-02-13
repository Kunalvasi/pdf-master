"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

type Props = {
  title: string;
  description: string;
  children: ReactNode;
};

export function ToolShell({ title, description, children }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Card className="glass mx-auto max-w-3xl space-y-4">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="mt-1">{description}</CardDescription>
        </div>
        {children}
      </Card>
    </motion.div>
  );
}
