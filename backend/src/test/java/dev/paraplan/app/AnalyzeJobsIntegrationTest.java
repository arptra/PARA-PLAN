package dev.paraplan.app;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.fail;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AnalyzeJobsIntegrationTest {

  @Autowired
  MockMvc mockMvc;

  ObjectMapper mapper = new ObjectMapper();

  @Test
  void createJobAndCheckStatus() throws Exception {
    MvcResult res = mockMvc.perform(post("/analyze-jobs")
            .header("Authorization", "Bearer demo")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"query\":\"select 1\"}"))
        .andExpect(status().isAccepted())
        .andReturn();
    JsonNode body = mapper.readTree(res.getResponse().getContentAsString());
    String jobId = body.get("jobId").asText();
    for (int i = 0; i < 20; i++) {
      MvcResult statusRes = mockMvc.perform(get("/jobs/" + jobId)
              .header("Authorization", "Bearer demo"))
          .andExpect(status().isOk())
          .andReturn();
      JsonNode statusBody = mapper.readTree(statusRes.getResponse().getContentAsString());
      if ("SUCCEEDED".equals(statusBody.get("state").asText())) {
        return;
      }
      Thread.sleep(200);
    }
    fail("Job not completed");
  }
}
