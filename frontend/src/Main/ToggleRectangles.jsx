// components/Meddle/ToggleRectangles.jsx
import React, { useState } from 'react';
import styled from 'styled-components';

const ToggleRectangles = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const rectangles = ['Rect 1', 'Rect 2', 'Rect 3']; // 예시

    return (
        <RectContainer>
            {rectangles.map((rect, idx) => (
                <Rect
                    key={idx}
                    active={activeIndex === idx}
                    onClick={() => setActiveIndex(idx)}
                >
                    {rect}
                </Rect>
            ))}
        </RectContainer>
    );
};

export default ToggleRectangles;

const RectContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Rect = styled.div`
  width: 100px;
  height: 100px;
  background-color: ${({ active }) => (active ? '#3498db' : '#ccc')};
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  border-radius: 8px;
  transition: background-color 0.3s ease;
`;
