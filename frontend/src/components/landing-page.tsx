import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { 
  ArrowRight, Sparkles, Zap, Shield, FileText, 
  Tag, Search, Smartphone, Laptop, 
  Clock, CheckCircle, XCircle
} from "lucide-react"
import { 
  Card, 
  CardContent,
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"

export function LandingPage() {
  return (
    <div className="flex flex-col w-full mx-0 px-0">
      {/* Hero Section */}
      <section className="w-full py-24 md:py-32 lg:py-40 bg-black text-white relative overflow-hidden">
        
        <div className="container flex max-w-5xl flex-col items-center gap-8 text-center mx-auto px-4 md:px-6 relative z-10">
          <div className="flex items-center justify-center">
            <Logo className="text-white scale-150" />
          </div>
          
          <div className="space-y-4">
            <h1 className="font-heading text-5xl font-bold sm:text-6xl md:text-7xl lg:text-8xl tracking-tight">
              <span className="block">Radically better</span>
              <span className="block">note-taking</span>
            </h1>
            <p className="max-w-[42rem] text-lg leading-normal text-white/70 sm:text-xl sm:leading-8 mt-10">
              Private Markdown notes with AI that runs in your browser. Fast, secure, and always available.
            </p>
          </div>
          
          <div className="flex gap-4 mt-6">
            <Button size="lg" className="h-12 px-8 rounded-full" asChild>
              <Link to="/register">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 rounded-full bg-white/5 hover:bg-white/10 border-white/20" asChild>
              <Link to="/notes">
                Try Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Grid */}
      <section className="container max-w-6xl mx-auto py-24 px-4 md:px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-1.5 font-medium" variant="outline">Features</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need for better notes
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Designed for simplicity, built for productivity. LightNote helps you capture and organize your thoughts without getting in your way.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border shadow-sm transition-all hover:shadow-md overflow-hidden">
            <div className="p-1 flex justify-center">
              <FileText className="h-12 w-12 my-6 text-primary/80" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle>Markdown That Looks Great</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Write in plain text or rich Markdown with instant preview. Format notes exactly the way you want them.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border shadow-sm transition-all hover:shadow-md overflow-hidden">
            <div className="p-1 flex justify-center">
              <Shield className="h-12 w-12 my-6 text-primary/80" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle>100% Private</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your notes stay on your device. AI features run directly in your browser — no data sent to servers.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border shadow-sm transition-all hover:shadow-md overflow-hidden">
            <div className="p-1 flex justify-center">
              <Tag className="h-12 w-12 my-6 text-primary/80" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle>Simple Organization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Tag your notes and find them instantly. No complex folder hierarchies needed.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border shadow-sm transition-all hover:shadow-md overflow-hidden">
            <div className="p-1 flex justify-center">
              <Search className="h-12 w-12 my-6 text-primary/80" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle>Instant Search</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Find what you need in milliseconds with powerful search across all your notes, tags, and content.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border shadow-sm transition-all hover:shadow-md overflow-hidden">
            <div className="p-1 flex justify-center">
              <Sparkles className="h-12 w-12 my-6 text-primary/80" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle>AI Assistance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get intelligent suggestions, summaries, and help with formatting — running entirely on your device.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border shadow-sm transition-all hover:shadow-md overflow-hidden">
            <div className="p-1 flex justify-center">
              <Zap className="h-12 w-12 my-6 text-primary/80" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle>Blazing Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Launch instantly and enjoy smooth performance on any device. No waiting, no lag.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="w-full py-24 md:py-32 border-y">
        <div className="container max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-1.5 font-medium" variant="outline">Pricing</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose the Plan That Works for You
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From casual note-taking to professional use, we have options for everyone
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <Card className="border shadow-sm flex flex-col">
              <CardHeader className="pb-2 text-center">
                <Badge variant="outline" className="mb-2 self-center">Basic</Badge>
                <CardTitle className="text-2xl">Basic</CardTitle>
                <p className="text-3xl font-bold mt-2">Free</p>
                <p className="text-sm text-muted-foreground">Limited features</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2 mt-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary/80 mt-0.5 flex-shrink-0" />
                    <span>Up to 20 notes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary/80 mt-0.5 flex-shrink-0" />
                    <span>Basic Markdown support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary/80 mt-0.5 flex-shrink-0" />
                    <span>Local storage only</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary/80 mt-0.5 flex-shrink-0" />
                    <span>Single device use</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">No AI features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">No cloud backup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Limited export options</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-4">
                <Button variant="outline" className="w-full rounded-full" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* Pro Plan */}
            <Card className="border-2 border-primary/50 shadow-lg flex flex-col relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Badge className="bg-primary text-primary-foreground px-3 py-1">Popular</Badge>
              </div>
              <CardHeader className="pb-2 text-center">
                <Badge variant="outline" className="mb-2 self-center">Pro</Badge>
                <CardTitle className="text-2xl">Pro</CardTitle>
                <p className="text-3xl font-bold mt-2">$7.99</p>
                <p className="text-sm text-muted-foreground">per month</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2 mt-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary/80 mt-0.5 flex-shrink-0" />
                    <span>Unlimited notes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary/80 mt-0.5 flex-shrink-0" />
                    <span>Advanced Markdown with extras</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary/80 mt-0.5 flex-shrink-0" />
                    <span>Cloud sync across 3 devices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary/80 mt-0.5 flex-shrink-0" />
                    <span>Basic AI assistance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary/80 mt-0.5 flex-shrink-0" />
                    <span>PDF & HTML export</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary/80 mt-0.5 flex-shrink-0" />
                    <span>Auto backup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">No collaboration features</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-4">
                <Button className="w-full rounded-full" asChild>
                  <Link to="/register">Subscribe Now</Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* Business Plan */}
            <Card className="border shadow-sm flex flex-col">
              <CardHeader className="pb-2 text-center">
                <Badge variant="outline" className="mb-2 self-center">Business</Badge>
                <CardTitle className="text-2xl">Business</CardTitle>
                <p className="text-3xl font-bold mt-2">$16.99</p>
                <p className="text-sm text-muted-foreground">per month</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2 mt-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary/80 mt-0.5 flex-shrink-0" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary/80 mt-0.5 flex-shrink-0" />
                    <span>Unlimited devices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary/80 mt-0.5 flex-shrink-0" />
                    <span>Advanced AI features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary/80 mt-0.5 flex-shrink-0" />
                    <span>Team workspaces</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary/80 mt-0.5 flex-shrink-0" />
                    <span>Collaboration with up to 10 users</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary/80 mt-0.5 flex-shrink-0" />
                    <span>Admin controls & audit logs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary/80 mt-0.5 flex-shrink-0" />
                    <span>API access</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-4">
                <Button variant="outline" className="w-full rounded-full" asChild>
                  <Link to="/register">Contact Sales</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
      
      {/* PWA Section */}
      <section className="w-full py-24 md:py-32 border-b">
        <div className="container max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 px-4 py-1.5 font-medium" variant="outline">Install on Any Device</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Use LightNote Anywhere, Online or Offline
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                LightNote works like a native app but without the app store. Install on your phone, tablet, or computer with one click for instant access anytime.
              </p>
              
              <ul className="space-y-6">
                <li className="flex items-center justify-center gap-4">
                  
                  <div>
                    <h3 className="font-medium text-lg">Install Like an App</h3>
                    <p className="text-muted-foreground">Add to home screen with one tap – no app store required</p>
                  </div>
                </li>
                
                <li className="flex items-center justify-center gap-4">
                  
                  <div>
                    <h3 className="font-medium text-lg">Work Offline</h3>
                    <p className="text-muted-foreground">Continue writing and editing even without internet access</p>
                  </div>
                </li>
                
                <li className="flex items-center justify-center gap-4">
                  
                  <div>
                    <h3 className="font-medium text-lg">Secure Syncing</h3>
                    <p className="text-muted-foreground">End-to-end encrypted sync when you're ready to connect</p>
                  </div>
                </li>
              </ul>
              
              <Button className="mt-8 gap-2 rounded-full px-8" asChild>
                <Link to="/notes">
                  Try It Now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Card className="border shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-center gap-3">
                      <Smartphone className="h-6 w-6 text-primary/80" />
                      <CardTitle>Mobile-Optimized</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      LightNote adapts perfectly to any screen size. The interface is designed for touch and keyboard, giving you a seamless experience on any device.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="border shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-center gap-3">
                    <Clock className="h-6 w-6 text-primary/80" />
                    <CardTitle>Auto-Saving</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Never lose your work. Changes are saved as you type, even when offline.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-center gap-3">
                    <Laptop className="h-6 w-6 text-primary/80" />
                    <CardTitle>Cross-Device</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Start on one device, continue on another. Your notes go where you go.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="container max-w-6xl mx-auto py-24 px-4 md:px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-1.5 font-medium" variant="outline">Simple Process</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How LightNote Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Designed to make note-taking effortless and seamless in your daily workflow
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-card border border-primary/20 flex items-center justify-center mb-6">
              <span className="text-xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Create</h3>
            <p className="text-muted-foreground">
              Start writing immediately with our clean, distraction-free editor. Format with simple Markdown or use the toolbar.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-card border border-primary/20 flex items-center justify-center mb-6">
              <span className="text-xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Organize</h3>
            <p className="text-muted-foreground">
              Add tags to keep related notes together. Use the powerful search to find anything instantly.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-card border border-primary/20 flex items-center justify-center mb-6">
              <span className="text-xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Access</h3>
            <p className="text-muted-foreground">
              Your notes are available on all your devices. Work offline and sync automatically when you reconnect.
            </p>
          </div>
        </div>
      </section>
      
      {/* Daily Use Cases */}
      <section className="w-full py-24 md:py-32 border-y">
        <div className="container max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-1.5 font-medium" variant="outline">Daily Benefits</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How People Use LightNote
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Perfect for many different needs in your personal and work life
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>Meeting Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Quickly capture key points during meetings. Use AI to summarize and extract action items automatically, all while keeping your notes private.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>Personal Journal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Keep a daily journal with complete privacy. Your thoughts stay on your device, and the simple interface makes daily journaling a pleasure.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>Project Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Organize your projects with to-do lists, timelines, and reference materials. Tag related notes together for easy project management.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>Study Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Create effective study materials with formatting options. Use AI to help generate questions for revision and organize complex topics.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="container max-w-4xl mx-auto py-24 px-4 md:px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-1.5 font-medium" variant="outline">Questions</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to know about LightNote
          </p>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-b">
            <AccordionTrigger className="text-left text-lg font-medium py-4">What's included in the free Basic plan?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-4">
              The Basic plan includes up to 20 notes, basic Markdown support, and local storage on a single device. This is perfect for trying out LightNote, but for AI features, cloud sync, and unlimited notes, you'll need a Pro or Business subscription.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2" className="border-b">
            <AccordionTrigger className="text-left text-lg font-medium py-4">How does LightNote protect my privacy?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-4">
              LightNote stores your notes locally on your device by default. Our AI features run directly in your browser, so your data never leaves your device without your explicit permission. With our paid plans, all cloud-synced data is end-to-end encrypted, meaning even we can't read your notes.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3" className="border-b">
            <AccordionTrigger className="text-left text-lg font-medium py-4">Can I use LightNote offline?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-4">
              Absolutely! LightNote works completely offline. Your notes are stored locally, and you can create, edit, and search without an internet connection. With our paid plans, when you go back online, any changes will sync automatically across all your devices.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4" className="border-b">
            <AccordionTrigger className="text-left text-lg font-medium py-4">What AI features are available in the paid plans?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-4">
              Pro users get basic AI features including summarization, formatting suggestions, and simple content generation. Business users get advanced AI capabilities like meeting note assistance, automatic tagging suggestions, content restructuring, and data extraction from notes.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-left text-lg font-medium py-4">Can I switch between plans?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-4">
              Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to all the new features. If you downgrade to the free plan, you'll keep all your notes but will only be able to access the most recent 20 notes until you upgrade again.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
      
      {/* CTA Section */}
      <section className="w-full py-24 md:py-32 px-4 md:px-6 border-t">
        <div className="container max-w-5xl mx-auto text-center">
          <Badge className="mb-4 px-4 py-1.5 font-medium" variant="outline">Join Now</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Try our Basic plan free, or unlock all features with Pro for just $7.99/month.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="gap-2 rounded-full px-8" asChild>
              <Link to="/register">
                Start For Free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-8" asChild>
              <Link to="/pricing">View All Plans</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 