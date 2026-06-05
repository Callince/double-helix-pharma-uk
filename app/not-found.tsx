import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container size="narrow" className="py-24 text-center sm:py-32">
      <p className="font-display text-6xl font-bold text-gradient-brand">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-navy">
        Page not found
      </h1>
      <p className="mx-auto mt-3 max-w-md text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back on
        track.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/" variant="gradient" withArrow>
          Back to home
        </Button>
        <Button href="/services" variant="outline">
          View services
        </Button>
      </div>
    </Container>
  );
}
