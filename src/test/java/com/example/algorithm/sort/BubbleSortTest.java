package com.example.algorithm.sort;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * {@link BubbleSort} 单元测试
 */
@DisplayName("冒泡排序工具类测试")
class BubbleSortTest {

    // ==================== sort(int[]) 正常路径测试 ====================

    @Test
    @DisplayName("正常路径：对无序数组进行升序排序")
    void should_returnSortedArray_when_givenUnsortedArray() {
        // Arrange
        int[] input = {5, 3, 8, 1, 2};

        // Act
        int[] result = BubbleSort.sort(input);

        // Assert
        assertThat(result).containsExactly(1, 2, 3, 5, 8);
    }

    @Test
    @DisplayName("正常路径：对已排序数组排序后保持不变")
    void should_returnSameOrder_when_arrayAlreadySorted() {
        // Arrange
        int[] input = {1, 2, 3, 4, 5};

        // Act
        int[] result = BubbleSort.sort(input);

        // Assert
        assertThat(result).containsExactly(1, 2, 3, 4, 5);
    }

    @Test
    @DisplayName("正常路径：对逆序数组排序为升序")
    void should_returnSortedArray_when_givenReverseSortedArray() {
        // Arrange
        int[] input = {5, 4, 3, 2, 1};

        // Act
        int[] result = BubbleSort.sort(input);

        // Assert
        assertThat(result).containsExactly(1, 2, 3, 4, 5);
    }

    // ==================== sort(int[]) 边界值测试 ====================

    @Test
    @DisplayName("边界值：单元素数组排序后不变")
    void should_returnSameArray_when_givenSingleElement() {
        // Arrange
        int[] input = {42};

        // Act
        int[] result = BubbleSort.sort(input);

        // Assert
        assertThat(result).containsExactly(42);
    }

    @Test
    @DisplayName("边界值：空数组排序后仍为空数组")
    void should_returnEmptyArray_when_givenEmptyArray() {
        // Arrange
        int[] input = {};

        // Act
        int[] result = BubbleSort.sort(input);

        // Assert
        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("边界值：含重复元素的数组正确排序")
    void should_returnSortedArray_when_givenDuplicateElements() {
        // Arrange
        int[] input = {3, 1, 2, 3, 1};

        // Act
        int[] result = BubbleSort.sort(input);

        // Assert
        assertThat(result).containsExactly(1, 1, 2, 3, 3);
    }

    @Test
    @DisplayName("边界值：含负数的数组正确排序")
    void should_returnSortedArray_when_givenNegativeNumbers() {
        // Arrange
        int[] input = {-3, 0, -1, 5, 2};

        // Act
        int[] result = BubbleSort.sort(input);

        // Assert
        assertThat(result).containsExactly(-3, -1, 0, 2, 5);
    }

    // ==================== sort(int[]) 异常路径测试 ====================

    @Test
    @DisplayName("异常路径：传入 null 时抛出 IllegalArgumentException")
    void should_throwException_when_inputIsNull() {
        // Act & Assert
        assertThatThrownBy(() -> BubbleSort.sort(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("null");
    }

    // ==================== sort(int[]) 不修改原数组测试 ====================

    @Test
    @DisplayName("排序后返回新数组，不修改原数组")
    void should_notModifyOriginalArray_when_sorted() {
        // Arrange
        int[] original = {5, 3, 1};
        int[] expected = {5, 3, 1};

        // Act
        BubbleSort.sort(original);

        // Assert
        assertThat(original).containsExactly(expected);
    }
}
