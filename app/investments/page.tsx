// app/investments/page.tsx

import Link from 'next/link';
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Sample investment opportunities (placeholder data)
const sampleProjects = [
    {
        id: 1,
        title: 'Olive Grove Expansion — Sfax',
        short: 'Expand an existing olive grove and install modern drip irrigation.',
        amountNeeded: '120,000 TND',
        minInvestment: '5,000 TND',
        expectedROI: '12% / year',
        location: 'Sfax',
        progress: 42,
    },
    {
        id: 2,
        title: 'Greenhouse Vegetables — Nabeul',
        short: 'Automated greenhouse for year-round high-value vegetables.',
        amountNeeded: '60,000 TND',
        minInvestment: '2,000 TND',
        expectedROI: '14% / year',
        location: 'Nabeul',
        progress: 76,
    },
    {
        id: 3,
        title: 'Post-Harvest Cold Storage — Kairouan',
        short: 'Shared cold storage facility to reduce post-harvest loss.',
        amountNeeded: '200,000 TND',
        minInvestment: '10,000 TND',
        expectedROI: '9% / year',
        location: 'Kairouan',
        progress: 18,
    },
    {
        id: 4,
        title: 'Solar Irrigation Project — Tozeur',
        short: 'Replace diesel pumps with solar-powered irrigation for small farms.',
        amountNeeded: '95,000 TND',
        minInvestment: '3,000 TND',
        expectedROI: '11% / year',
        location: 'Tozeur',
        progress: 55,
    },
];

function InvestmentCard({ project }: { project: (typeof sampleProjects)[0] }) {
    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-200 overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-green-100 to-gray-50 flex items-center justify-center text-green-700 font-semibold text-lg">
                {/* Placeholder visual */}
                {project.title}
            </div>
            <div className="p-4">
                <h3 className="text-lg font-bold text-green-800 truncate">{project.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{project.short}</p>

                <div className="mt-3 flex items-center justify-between">
                    <div>
                        <div className="text-xs text-gray-500">Needed</div>
                        <div className="text-sm font-semibold text-green-700">{project.amountNeeded}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500">Min</div>
                        <div className="text-sm font-semibold">{project.minInvestment}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500">ROI</div>
                        <div className="text-sm font-semibold text-green-700">{project.expectedROI}</div>
                    </div>
                </div>

                <div className="mt-3">
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${project.progress}%` }} />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Funded {project.progress}% • {project.location}</div>
                </div>

                <div className="mt-4 flex gap-3">
                    <Link href={`/investments/${project.id}`} className="flex-1 text-center py-2 rounded-md border border-green-600 text-green-600 hover:bg-green-50">View Project</Link>
                    <Link href={`/investments/${project.id}#invest`} className="flex-1 text-center py-2 rounded-md bg-green-600 text-white hover:bg-green-700">Invest</Link>
                </div>
            </div>
        </div>
    );
}

export default function InvestmentsPage() {
    return (
        <>
            <Header />
            <main className="max-w-7xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-extrabold text-green-900">Investments & Funding Opportunities</h1>
                            <p className="mt-2 text-gray-600">Support impactful Tunisian agriculture projects and earn predictable returns.</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="text-center px-4 py-3 bg-gray-50 rounded-lg">
                                <div className="text-sm text-gray-500">Open Projects</div>
                                <div className="text-lg font-bold text-green-700">{sampleProjects.length}</div>
                            </div>
                            <Link href="/investments/start" className="px-5 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">Start a Project</Link>
                        </div>
                    </div>
                </div>

                <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1 bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h2 className="text-lg font-bold text-green-800 mb-4">Filters</h2>
                        <div className="space-y-4 text-gray-700">
                            <div>
                                <label className="block text-sm font-medium mb-2">Search</label>
                                <input placeholder="Search projects" className="w-full p-2 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Location</label>
                                <input placeholder="e.g., Sfax" className="w-full p-2 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Minimum Investment</label>
                                <select className="w-full p-2 border rounded-md">
                                    <option>Any</option>
                                    <option>&lt; 2,000 TND</option>
                                    <option>2,000 - 5,000 TND</option>
                                    <option>&gt; 5,000 TND</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Category</label>
                                <select className="w-full p-2 border rounded-md">
                                    <option>All</option>
                                    <option>Olives & Trees</option>
                                    <option>Greenhouse</option>
                                    <option>Cold Storage</option>
                                    <option>Renewables</option>
                                </select>
                            </div>
                        </div>
                    </aside>

                    {/* Projects Grid */}
                    <section className="lg:col-span-3">
                        <div className="mb-4 text-gray-600">Showing 1 - {sampleProjects.length} of {sampleProjects.length} projects</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sampleProjects.map(p => (
                                <InvestmentCard key={p.id} project={p} />
                            ))}
                        </div>
                    </section>
                </section>
            </main>
            <Footer />
        </>
    );
}