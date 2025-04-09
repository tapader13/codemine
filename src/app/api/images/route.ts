import { type NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number.parseInt(searchParams.get('page') || '1');
  const limit = Number.parseInt(searchParams.get('limit') || '12');
  const offset = (page - 1) * limit;

  try {
    const result = await cloudinary.search
      .expression('resource_type:image AND folder=gallery')
      .sort_by('created_at', 'desc')
      .max_results(limit)
      .next_cursor(offset > 0 ? `${offset}` : undefined)
      .execute();

    const images = result.resources.map((resource: any) => ({
      id: resource.public_id,
      url: resource.secure_url,
      title: resource.context?.title || resource.public_id.split('/').pop(),
      tags: resource.tags || [],
      createdAt: resource.created_at,
    }));

    return NextResponse.json({
      images,
      hasMore: result.total_count > offset + limit,
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
