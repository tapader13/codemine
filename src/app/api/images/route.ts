import { type NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number.parseInt(searchParams.get('page') || '1');
  const limit = Number.parseInt(searchParams.get('limit') || '12');

  try {
    const result = await cloudinary.search
      .expression('resource_type:image AND folder=gallery')
      .sort_by('created_at', 'desc')
      .max_results(limit * page)
      .execute();

    const images = result.resources.map((resource: any) => ({
      id: resource.public_id,
      url: resource.secure_url,
      title: resource.context?.title || resource.public_id.split('/').pop(),
      tags: resource.tags || [],
      createdAt: resource.created_at,
    }));

    const hasMore = result.total_count > page * limit;
    console.log('hasMore', hasMore, result.total_count, page * limit);
    console.log('images', images, page, limit);
    return NextResponse.json({
      images,
      hasMore,
      total: result.total_count,
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}
