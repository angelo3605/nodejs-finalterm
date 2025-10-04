import { getFilteredProductsService, getTopProductService } from "../services/productService.js";

export const getAllProduct = async (req, res) => {
  try {
    const { search, brandIds, categoryIds, minPrice, maxPrice, startDate, endDate, page = 1, pageSize = 10 } = req.body; // ✅ dùng body

    const filters = {
      search,
      brandIds: brandIds || [], 
      categoryIds: categoryIds || [],
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    const stats = await getFilteredProductsService(filters, parseInt(page), parseInt(pageSize));

    return res.json({
      products: stats.products,
      totalCount: stats.totalCount,
      totalPages: stats.totalPages,
      currentPage: parseInt(page),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTopProduct = async (req, res) => {
  try {
    const number = parseInt(req.query.number) || 5;

    const topProducts = await getTopProductService(number);

    return res.status(200).json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
