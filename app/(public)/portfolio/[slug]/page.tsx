import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle, ArrowRight } from "lucide-react";
import { getCaseStudy, getCaseStudies } from "@/app/actions/case-studies"; // <-- use the DB function
import { supabasePublic } from "@/lib/supabase/public";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const caseStudy = await getCaseStudy(params.slug); // <-- await the async DB call

  if (!caseStudy) {
    return {
      title: "Case Study Not Found",
    };
  }

  return {
    title: `${caseStudy.title} - Case Study`,
    description: caseStudy.summary,
  };
}

export async function generateStaticParams() {
  // const { data: caseStudies } = await supabasePublic
  //   .from("case_studies")
  //   .select("slug");
  const caseStudies = await getCaseStudies();
  return (caseStudies || []).map((study) => ({
    slug: study.slug,
  }));
}

export default async function CaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  const caseStudy = await getCaseStudy(params.slug); // <-- await the async DB call

  if (!caseStudy) {
    return (
      <div className="container mx-auto px-4 py-12">Case study not found</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/portfolio"
        className="inline-flex items-center text-accent1 mb-8 hover:underline"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Portfolio
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">{caseStudy.title}</h1>
        <p className="text-xl text-text-light mb-6">{caseStudy.summary}</p>
        <div className="flex flex-wrap gap-2">
          {caseStudy.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl mb-12">
        <Image
          src={caseStudy.image_url || "/placeholder.svg?height=1000&width=1920"}
          alt={caseStudy.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">The Challenge</h2>
          <p className="text-lg">{caseStudy.challenge}</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Approach</h2>
          <p className="text-lg">{caseStudy.approach}</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">The Solution</h2>
          <p className="text-lg">{caseStudy.solution}</p>
        </div>
      </div>

      <div className="bg-gray-50 p-8 rounded-2xl mb-16">
        <h2 className="text-2xl font-bold mb-6">Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {caseStudy.results.map((result, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl font-bold text-accent1 mb-2">
                {result.stat}
              </div>
              <div className="text-lg">{result.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Key Services Provided</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {caseStudy.services.map((service, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              <span>{service}</span>
            </li>
          ))}
        </ul>
      </div>

      {caseStudy.testimonial && (
        <div className="bg-blue-50 p-8 rounded-2xl mb-16">
          <div className="text-xl italic mb-4">
            "{caseStudy.testimonial.quote}"
          </div>
          <div className="font-bold">{caseStudy.testimonial.author}</div>
          <div className="text-text-light">
            {caseStudy.testimonial.role}, {caseStudy.testimonial.company}
          </div>
        </div>
      )}

      <div className="bg-gray-100 p-8 rounded-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Ready to achieve similar results?
            </h2>
            <p className="text-lg">
              Let's discuss how we can help your business grow.
            </p>
          </div>
          <Link
            href="/contact"
            className="mt-6 md:mt-0 inline-flex items-center px-6 py-3 bg-accent2 text-white font-medium rounded-lg hover:bg-accent2/80 transition-colors"
          >
            Get in Touch <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
