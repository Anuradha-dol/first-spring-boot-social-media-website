package com.socialApp.Lishare.dtos.postdTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FollowResponse {
    private Long userId;
    private String firstName;
    private String lastName;
    private boolean isFollowing;
}
