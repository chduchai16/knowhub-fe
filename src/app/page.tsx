import LandingPage from "@/features/client/pages/landing-page";

export default function Home() {
  // Middleware sẽ tự động redirect user đã login sang /feed
  return <LandingPage />;
}
