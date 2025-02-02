import { Suspense } from "react"
import { ArticleCard } from "@/components/article-card"
import { FilterSidebar } from "@/components/filter-sidebar"
import { SortDropdown } from "@/components/sort-dropdown"
import { getArticles, getCategories } from "@/lib/articles" // You'll need to implement these functions

export default async function ArticlesPage() {
  const articles = await getArticles()
  const categories = await getCategories()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">University Publications</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4">
          <Suspense fallback={<div>Loading filters...</div>}>
            <FilterSidebar
              categories={categories}
              onFilterChange={(filters) => {
                // Implement client-side filtering logic here
                console.log("Filters changed:", filters)
              }}
            />
          </Suspense>
        </aside>
        <main className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-muted-foreground">Showing {articles.length} articles</p>
            <SortDropdown
              onSortChange={(sortValue) => {
                // Implement client-side sorting logic here
                console.log("Sort changed:", sortValue)
              }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

