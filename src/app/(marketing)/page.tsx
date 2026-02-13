import Link from "next/link";
import { ArrowRight, History, Sparkles, Zap } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const features = [
  { title: "Merge PDFs", desc: "Drag, reorder, and combine files in one click.", icon: Sparkles },
  { title: "Compress Files", desc: "Reduce output size and compare before/after instantly.", icon: Zap },
  { title: "File History", desc: "Track recent outputs with auto-cleanup after 24 hours.", icon: History }
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-sky-500/20 via-cyan-400/20 to-teal-400/20" />
        <FadeIn>
          <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl md:text-6xl">Production-ready PDF tools for modern teams.</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Merge, compress, and convert with a clean workflow, secure storage, and downloadable outputs in seconds.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link href="/merge">Get Started</Link></Button>
            <Button asChild variant="outline" size="lg"><Link href="/merge">Try Merge Tool <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
        </FadeIn>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {features.map((feature, idx) => (
          <FadeIn key={feature.title} delay={idx * 0.08}>
            <Card className="glass h-full">
              <feature.icon className="h-8 w-8 text-primary" />
              <CardTitle className="mt-4">{feature.title}</CardTitle>
              <CardDescription className="mt-2">{feature.desc}</CardDescription>
            </Card>
          </FadeIn>
        ))}
      </section>
    </div>
  );
}

