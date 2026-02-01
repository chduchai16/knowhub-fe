import LandingPage from "@/features/user/components/client/landing-page";

export default function Home() {
  // Middleware sẽ tự động redirect user đã login sang /feed
  return <LandingPage />;
}
