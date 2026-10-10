package com.example.algorithm.sort;

/**
 * 冒泡排序工具类.
 *
 * <p>实现经典的冒泡排序算法，对 int 数组进行升序排列。
 * 时间复杂度：最坏/平均 O(n²)，最好 O(n)（已排序时提前退出）。
 * 空间复杂度：O(n)（返回新数组的拷贝）。</p>
 *
 * @author AiWork
 */
public final class BubbleSort {

    private BubbleSort() {
        throw new IllegalStateException("Utility class");
    }

    /**
     * 对给定的 int 数组进行冒泡升序排序，返回排序后的新数组（不修改原数组）。
     *
     * @param array 待排序数组，不允许为 null
     * @return 排序后的新数组
     * @throws IllegalArgumentException 当 array 为 null 时
     */
    public static int[] sort(int[] array) {
        if (array == null) {
            throw new IllegalArgumentException("Input array must not be null");
        }

        int length = array.length;
        int[] result = new int[length];
        System.arraycopy(array, 0, result, 0, length);

        for (int i = 0; i < length - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < length - 1 - i; j++) {
                if (result[j] > result[j + 1]) {
                    int temp = result[j];
                    result[j] = result[j + 1];
                    result[j + 1] = temp;
                    swapped = true;
                }
            }
            // 提前退出优化：本轮未发生交换说明已有序
            if (!swapped) {
                break;
            }
        }

        return result;
    }
}
